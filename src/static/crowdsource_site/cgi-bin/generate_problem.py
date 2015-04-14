#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 16 16:48:33 2015

@author: Shekar
"""

import json
import os
import cgi

data = cgi.FieldStorage()

game_filename = data['filename'].value


print os.getcwd()
piece_list = {}

data = {}

#problem_file = open("./problems/problem1.txt")
problem_file = open("./problems/" + str(game_filename))
total_atoms = problem_file.next()
for i,line in enumerate(problem_file):
    #Return only lines with text
    if line.rstrip():
        #print str(i) + ":" + line
        #strip() used to remove new line
        piece_list[str(i)] = line.strip()

#Hard coded for a particular problem CHANGE ASAP!
data["total_atoms"] = total_atoms.rstrip()
data["piece_list"] = piece_list
		
        
print "Content-type: application/json"
print
print json.dumps(data)
