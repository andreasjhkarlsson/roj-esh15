#!/bin/sh
rm -f roj.db
sqlite3 -init roj.sql roj.db ""