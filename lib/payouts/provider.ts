export type PayoutMethod = "airtel" | "mpamba" | "bank";

export type PayoutInput = {
  amount: number;
  method: PayoutMethod;
  destination: string;
  country?: string;
  currency?: string;
  recipientName?: string;
  bankCode?: string;
  bankName?: string;
  email?: string;
  reference: string;
};

export type PayoutResult = {
  accepted: boolean;
  status: "pending" | "completed" | "failed";
  providerReference?: string;
  message: string;
};

function env(name: string) {
  return process.env[name] || "";
}

async function payChanguPayout(input: PayoutInput): Promise<PayoutResult> {
  const secret = env("PAYCHANGU_SECRET_KEY");
  if (!secret) {
    return {
      accepted: false,
      status: "failed",
      message: "PayChangu payout credentials are not configured."
    };
  }

  const headers = {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  if (input.method === "airtel" || input.method === "mpamba") {
    const operator = env(
      input.method === "airtel"
        ? "PAYCHANGU_AIRTEL_OPERATOR_ID"
        : "PAYCHANGU_MPAMBA_OPERATOR_ID"
    );

    if (!operator) {
      return {
        accepted: false,
        status: "failed",
        message: `The ${input.method === "airtel" ? "Airtel Money" : "TNM Mpamba"} operator ID is not configured.`
      };
    }

    const response = await fetch(
      "https://api.paychangu.com/mobile-money/payouts/initialize",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          mobile_money_operator_ref_id: operator,
          mobile: input.destination,
          amount: String(input.amount),
          charge_id: input.reference,
          email: input.email || undefined,
          first_name: input.recipientName || undefined
        })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status !== "success") {
      return {
        accepted: false,
        status: "failed",
        message: data?.message || "Mobile-money payout was rejected."
      };
    }

    return {
      accepted: true,
      status: data?.data?.status === "successful" ? "completed" : "pending",
      providerReference:
        data?.data?.trans_id ||
        data?.data?.ref_id ||
        input.reference,
      message: data?.message || "Payout submitted successfully."
    };
  }

  const bankUuid = env("PAYCHANGU_BANK_UUID");

  if (!bankUuid) {
    return {
      accepted: false,
      status: "failed",
      message: "PayChangu bank payout is not configured."
    };
  }

  const response = await fetch(
    "https://api.paychangu.com/direct-charge/payouts/initialize",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        payout_method: "bank_transfer",
        bank_uuid: bankUuid,
        amount: String(input.amount),
        charge_id: input.reference,
        bank_account_name: input.recipientName || "",
        bank_account_number: input.destination,
        email: input.email || undefined
      })
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.status !== "success") {
    return {
      accepted: false,
      status: "failed",
      message: data?.message || "Bank payout was rejected."
    };
  }

  return {
    accepted: true,
    status:
      data?.data?.transaction?.status === "successful"
        ? "completed"
        : "pending",
    providerReference:
      data?.data?.transaction?.ref_id ||
      data?.data?.transaction?.trans_id ||
      input.reference,
    message: data?.message || "Bank payout submitted successfully."
  };
}

async function globalBankPayout(input: PayoutInput): Promise<PayoutResult> {
  const endpoint = env("GLOBAL_PAYOUT_API_URL");
  const secret = env("GLOBAL_PAYOUT_API_KEY");

  if (!endpoint || !secret) {
    return {
      accepted: false,
      status: "failed",
      message:
        "Worldwide bank payout provider is not configured yet. Add an approved global payout provider."
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Idempotency-Key": input.reference
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency || "USD",
      country: input.country,
      account_number: input.destination,
      bank_code: input.bankCode,
      bank_name: input.bankName,
      recipient_name: input.recipientName,
      email: input.email,
      reference: input.reference
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      accepted: false,
      status: "failed",
      message: data?.message || "Worldwide bank payout was rejected."
    };
  }

  return {
    accepted: true,
    status: data?.status === "completed" ? "completed" : "pending",
    providerReference:
      data?.provider_reference ||
      data?.reference ||
      input.reference,
    message: data?.message || "Worldwide bank payout submitted."
  };
}

export async function sendPayout(input: PayoutInput): Promise<PayoutResult> {
  if (input.method === "airtel" || input.method === "mpamba") {
    if (input.country && input.country !== "MW") {
      return {
        accepted: false,
        status: "failed",
        message: "Airtel Money and TNM Mpamba payouts are Malawi-only."
      };
    }

    return payChanguPayout(input);
  }

  if (input.country === "MW" && env("PAYCHANGU_SECRET_KEY")) {
    return payChanguPayout(input);
  }

  return globalBankPayout(input);
}
