-- Draft buildings: a building whose status is "draft" (set in the CMS under "3 · Označi stanove") is left out of
-- public_site_data(), together with its apartments, so unfinished work cannot be read through the public endpoint.
-- Only the function changes; no table is touched. Re-running it is safe.
create or replace function public.public_site_data()
returns jsonb language sql stable security definer set search_path = ''
as $$
  with s as (select coalesce((select data from public.site_content where key = 'settings'), '{}'::jsonb) d),
  sc as (select coalesce((select data from public.site_content where key = 'scenes'), '{"masterplan":{"views":[]},"buildings":[]}'::jsonb) d),
  live as (
    select coalesce(jsonb_agg(b.v order by b.n), '[]'::jsonb) arr
    from jsonb_array_elements(coalesce((select d -> 'buildings' from sc), '[]'::jsonb)) with ordinality as b(v, n)
    where coalesce(b.v ->> 'status', '') <> 'draft'
  )
  select jsonb_build_object(
    'settings', (select d from s),
    'page', coalesce((select data from public.site_content where key = 'page'), '{}'::jsonb),
    'scenes', jsonb_set((select d from sc), '{buildings}', (select arr from live)),
    'units', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', u.code, 'building', u.building, 'floor', u.floor, 'bedrooms', u.bedrooms,
        'area', u.area, 'area_net', u.area_net, 'orientation', u.orientation, 'status', u.status,
        'price', case when coalesce(((select d from s)->>'show_price')::boolean, false) and u.status <> 'sold' then u.price else null end,
        'type_label', u.type_label, 'plan', u.plan_path, 'pdf', u.pdf_path,
        'rooms', u.rooms, 'extra', u.extra, 'description', u.description
      ) order by u.building, u.floor, u.code)
      from public.units u
      where not u.hidden
        and not exists (
          select 1 from jsonb_array_elements(coalesce((select d -> 'buildings' from sc), '[]'::jsonb)) b
          where b ->> 'id' = u.building and b ->> 'status' = 'draft'
        )), '[]'::jsonb)
  )
$$;
grant execute on function public.public_site_data() to anon, authenticated;
