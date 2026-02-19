-- For historical reference or recreation, query used to create todos table
CREATE TABLE todos(
    id text not null primary key, 
    title text not null, 
    description text, 
    is_done boolean not null, 
    date_created date not null, 
    priority numeric not null);