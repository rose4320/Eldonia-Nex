import sqlite3

con=sqlite3.connect('db.sqlite3')
for r in con.execute("PRAGMA table_info('users_user');"):
    print(r)
con.close()
con.close()
