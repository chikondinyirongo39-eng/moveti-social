"use client";

export default function Dashboard() {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <header style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>MOVETI</h1>
            <p style={{ color: "#9da5b2", marginTop: "8px" }}>
              Artist Dashboard
            </p>
          </div>

          <button
            onClick={() => window.location.href = "/"}
            style={logoutStyle}
          >
            Log Out
          </button>
        </header>

        <section style={welcomeStyle}>
          <h2>Welcome, Artist 👋</h2>
          <p style={{ color: "#9da5b2" }}>
            Manage your music, artist profiles and distribution from one place.
          </p>
        </section>

        <div style={gridStyle}>

          <DashboardCard
            icon="🎵"
            title="My Releases"
            description="View and manage your submitted music."
            path="/releases"
          />

          <DashboardCard
            icon="📤"
            title="New Release"
            description="Submit a new song for distribution."
            path="/new-release"
          />

          <DashboardCard
            icon="🔗"
            title="Artist Profiles"
            description="Manage your existing streaming profiles."
            path="/profiles"
          />

          <DashboardCard
            icon="💳"
            title="Payments"
            description="View distribution payments and status."
            path="/payment"
          />

          <DashboardCard
            icon="🛠️"
            title="Help & Support"
            description="Get help with your releases."
            path="/support"
          />

          <DashboardCard
            icon="👤"
            title="My Account"
            description="Manage your artist information."
            path="/account"
          />

        </div>

        <section style={distributionStyle}>
          <h2>🌍 MOVETI Distribution</h2>

          <p style={{ color: "#9da5b2", lineHeight: 1.6 }}>
            Submit your music once and prepare it for distribution to the
            major platforms connected to your artist profiles.
          </p>

          <div style={platformStyle}>
            <span>🟢 Spotify</span>
            <span>🍎 Apple Music</span>
            <span>🔵 Audiomack</span>
            <span>🟠 Boomplay</span>
            <span>▶️ YouTube Music</span>
          </div>
        </section>

      </div>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  path
}: {
  icon: string;
  title: string;
  description: string;
  path: string;
}) {
  return (
    <button
      onClick={() => window.location.href = path}
      style={cardStyle}
    >
      <div style={{ fontSize: "32px" }}>{icon}</div>

      <h3 style={{ marginBottom: "8px" }}>
        {title}
      </h3>

      <p style={{
        color: "#9da5b2",
        lineHeight: 1.5,
        margin: 0
      }}>
        {description}
      </p>
    </button>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#07090d",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: "24px",
  boxSizing: "border-box" as const
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const logoutStyle = {
  padding: "11px 18px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#181d25",
  color: "white",
  fontWeight: "bold" as const
};

const welcomeStyle = {
  padding: "25px",
  background: "#11151c",
  border: "1px solid #252b35",
  borderRadius: "20px",
  marginBottom: "25px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px"
};

const cardStyle = {
  textAlign: "left" as const,
  padding: "22px",
  background: "#11151c",
  color: "white",
  border: "1px solid #252b35",
  borderRadius: "18px",
  cursor: "pointer"
};

const distributionStyle = {
  marginTop: "25px",
  padding: "25px",
  background: "#11151c",
  border: "1px solid #252b35",
  borderRadius: "20px"
};

const platformStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  marginTop: "20px"
};
