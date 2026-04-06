-- ================================================
-- 온라인 야근 — Supabase SQL 스키마
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ================================================

-- 1. messages 테이블
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  room        text not null,
  nick        text not null,
  text        text not null,
  created_at  timestamptz not null default now()
);

-- 오래된 메시지 자동 인덱스 (방별 최근 메시지 조회용)
create index if not exists messages_room_created_at_idx
  on public.messages (room, created_at desc);

-- 2. 메시지 자동 삭제 (24시간 이상 된 메시지 — 선택사항)
-- create extension if not exists pg_cron;
-- select cron.schedule('delete-old-messages', '0 * * * *',
--   $$ delete from public.messages where created_at < now() - interval '24 hours' $$
-- );

-- 3. Row Level Security 설정
alter table public.messages enable row level security;

-- 누구나 읽기 가능
create policy "Anyone can read messages"
  on public.messages for select
  using (true);

-- 누구나 쓰기 가능 (익명 서비스)
create policy "Anyone can insert messages"
  on public.messages for insert
  with check (
    length(text) <= 200
    and length(nick) <= 50
    and room in ('startup', 'bigcorp', 'remote', 'parttime', 'silence')
  );

-- 4. Realtime 활성화
-- Supabase Dashboard > Database > Replication 에서
-- messages 테이블의 INSERT 이벤트를 활성화하세요.
-- 또는 아래 명령 실행:
alter publication supabase_realtime add table public.messages;

-- ================================================
-- 완료! 이제 .env.local 에 URL과 ANON KEY 입력하세요.
-- ================================================
