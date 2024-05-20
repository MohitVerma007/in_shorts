-- users table 
create table users(
  user_id serial primary key,
  username varchar(255) unique not null,
  email varchar(255) unique not null,
  password varchar(255) not null,
  phone varchar(255) not null,
  created_at date default current_date
);

CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_img VARCHAR(255),
    description TEXT,
    created_at date default current_date
);
