create table if not exists  carts (
	id uuid not null default uuid_generate_v4() primary key,
	user_id uuid not null,
	created_at date NOT NULL now(),
	updated_at date NOT NULL now(),
	status status_enum
);

create extension if not exists "uuid-ossp";

create table if not exists cart_items (
	product_id uuid not null,
	count int NOT null,
	cart_id uuid not null,
	foreign key ("cart_id") references "carts" ("id")
);

create table if not exists users (
	id uuid not null default uuid_generate_v4() primary key,
	name text not null,
	email text not null,
	password text not null
);

-- alter table cart_items add column cart_id uuid references carts(id);

-- CREATE type status_enum AS ENUM ('OPEN', 'ORDERED');

-- insert into users (name, email, password) values ('John Doe', 'john@testemail.io', 'qwerty');

--insert into carts (user_id, status) values ('e081beae-bf63-4360-a115-6c88b4d21376', 'OPEN');

insert into cart_items (product_id, count, cart_id) values
('5ac9202f-b107-4c61-9305-b2bd7be24115', 3, '4676c47d-f885-452a-98e7-a9b549ee6e5e'),
('6f42e55f-a03d-4c73-8c12-7a7023a22c15', 1, '4676c47d-f885-452a-98e7-a9b549ee6e5e'),
('3238ac16-558c-4c04-9ce7-69b78ef07c41', 7, '4676c47d-f885-452a-98e7-a9b549ee6e5e');