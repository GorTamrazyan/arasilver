-- Платёжный слой ARASILVER (ArCa / Idram).
-- Отдельная таблица payments: полный аудит и несколько попыток оплаты на заказ.
-- Статус заказа (orders.status) меняется на 'confirmed' при успешной оплате.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null check (provider in ('arca', 'idram', 'mock')),
  -- Идентификатор платежа на стороне банка (mdOrder ArCa / trans id Idram).
  provider_payment_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  -- Сумма в минорных единицах (лума). См. lib/payments/money.ts.
  amount_minor bigint not null default 0,
  currency text not null default 'AMD',
  -- Сырой payload колбэка банка — для разбора спорных ситуаций.
  raw_callback jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_payments_provider_payment_id on public.payments(provider_payment_id);
create index if not exists idx_payments_status on public.payments(status);

-- RLS: запись в payments идёт ТОЛЬКО из вебхуков под service-role ключом
-- (lib/supabase/service.ts), который обходит RLS. Поэтому публичных
-- INSERT/UPDATE политик нет. Чтение покупателем своих платежей — через заказ.
alter table public.payments enable row level security;

-- Покупатель видит платежи по своим заказам (заказ привязан к user_id).
drop policy if exists "users read own payments" on public.payments;
create policy "users read own payments" on public.payments
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id and o.user_id = auth.uid()
    )
  );
