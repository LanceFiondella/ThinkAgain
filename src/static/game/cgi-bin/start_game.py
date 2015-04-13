import os
import json
import cgi
import subprocess

#data = cgi.FieldStorage()
print os.getcwd()
#os.chdir("") 
print os.getcwd()
#game_filename = data['filename']
game_text = subprocess.call('../problems/sgen1 -unsat -n 5 > sgen_problem.txt',shell=True,)

