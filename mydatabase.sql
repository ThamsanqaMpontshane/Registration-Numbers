Create table towns (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    plate varchar(255) NOT NULL
);

Insert into towns (name, plate) values ('Cape Town', 'CA');
Insert into towns (name, plate) values ('Bellville', 'CY');
Insert into towns (name, plate) values ('Paarl', 'CL');


Create table reg_numbers (
    id serial primary key,
    reg_number varchar(255) not null,
    town_id integer not null,
    FOREIGN KEY (town_id) REFERENCES towns (id)
);
