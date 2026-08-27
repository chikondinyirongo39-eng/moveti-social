create or replace function public.create_moveti_notification(
  target_user uuid,
  notification_type text,
  notification_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_user is null then
    return;
  end if;

  insert into public.notifications (
    user_id,
    type,
    message,
    read
  )
  values (
    target_user,
    notification_type,
    notification_message,
    false
  );
end;
$$;

create or replace function public.notify_new_follower()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.create_moveti_notification(
    NEW.following_id,
    'follow',
    'Someone started following you.'
  );

  return NEW;
end;
$$;

drop trigger if exists moveti_new_follower_notification
on public.followers;

create trigger moveti_new_follower_notification
after insert on public.followers
for each row
execute function public.notify_new_follower();

create or replace function public.notify_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.create_moveti_notification(
    NEW.receiver_id,
    'message',
    'You received a new message.'
  );

  return NEW;
end;
$$;

drop trigger if exists moveti_new_message_notification
on public.messages;

create trigger moveti_new_message_notification
after insert on public.messages
for each row
execute function public.notify_new_message();

create or replace function public.notify_post_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  select user_id
  into owner_id
  from public.posts
  where id = NEW.post_id;

  if owner_id is not null and owner_id <> NEW.user_id then
    perform public.create_moveti_notification(
      owner_id,
      'like',
      'Someone liked your post.'
    );
  end if;

  return NEW;
end;
$$;

drop trigger if exists moveti_post_like_notification
on public.post_likes;

create trigger moveti_post_like_notification
after insert on public.post_likes
for each row
execute function public.notify_post_like();

create or replace function public.notify_post_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_id uuid;
begin
  select user_id
  into owner_id
  from public.posts
  where id = NEW.post_id;

  if owner_id is not null and owner_id <> NEW.user_id then
    perform public.create_moveti_notification(
      owner_id,
      'comment',
      'Someone commented on your post.'
    );
  end if;

  return NEW;
end;
$$;

drop trigger if exists moveti_post_comment_notification
on public.post_comments;

create trigger moveti_post_comment_notification
after insert on public.post_comments
for each row
execute function public.notify_post_comment();

select 'MOVETI notification system created successfully.' as status;
