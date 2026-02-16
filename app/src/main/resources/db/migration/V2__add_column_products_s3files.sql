alter table products add column del_flg boolean not null default false;
alter table s3_files add column del_flg boolean not null default false;