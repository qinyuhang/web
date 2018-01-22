# web - a koa roll publish framework
## Why make this project?
What behind this project is that when I deploy my project in my VPS, 
It is not easy to update the hole site especially when having a small 
project, so I thought, can I start a router to handle push web hook from
the GitHub or GitLab, and then pull the code from the configured repo 
to update the web?

This is how the project start. It uses node8 + koajs to start the server, 
and has a router of /git to handle push event from GitHub or GitLab.

# How to use?

1. clone this repo to your own (private or public) repo.

2. Add ssh key of your VPS to the GitHub/GitLab repo's DEPLOY KEY.

3. Pull code to your VPS.

4. cd the repo and `cp start.sh.example start.sh` and then modify it if you want use a secret when handle GitHub/GitLab webhook.

5. cd the repo on your VPS and `sh start.sh &!` to make sure it runs on background.

6. configure NGINX or APACHE.

7. Now all is set! Just clone the repo to your work desktop and start develop. Every push will trigger the site on your vps update!