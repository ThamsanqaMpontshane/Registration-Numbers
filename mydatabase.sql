Create table towns (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    plate varchar(255) NOT NULL,
);
Create table reg_numbers (
    id serial primary key,
    reg_number varchar(255) not null,
    town_id integer not null,
    FOREIGN KEY (town_id) REFERENCES towns (id)
);
