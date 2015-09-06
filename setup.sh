#!/bin/sh
# For backend
cd server
sudo npm install -g supervisor
npm install express
npm install sqlite3
cd ..
cd webapp
# For frontend
sudo npm install -g bower
bower install materialize
bower install chartist
