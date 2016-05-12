#Synopsis
'Think Again!' uses the power of crowds to solve large propositional logic problems. The problems are encoded as puzzle pieces that the has to combine and solve

#Dependencies
This project mainly uses Django 1.8 to handle the website (authentication, admin, serving static files) and swampdragon to facilitate real time data transfer for multiplayer game and chat room. Will change to Django channels when version 1.10 is out.

First make sure the python-dev package is installed:
`sudo apt-get install build-essential python-dev`

Install Swampdragon using pip:
`sudo pip install swampdragon`

Make sure you have redis installed:
`sudo apt-get -y install redis-server`

#Running the project
Open 2 terminals. Navigate to the src folder in both.
In terminal 1:
`python manage.py runserver`
In terminal 2:
`python server.py`

This should start the Django server in terminal 1 and Swampdragon server in terminal 2

Open your browser and go to localhost:8000 (If you started the Django server on port 8000

Register and enjoy the game!
