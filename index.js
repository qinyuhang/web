const crypto = require('crypto');
const execFile = require('child_process').execFile;
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const GITLAB_TOKEN = process.env._GITLAB_SECRET;
const GITHUB_TOKEN = process.env._GITHUB_SECRET;

const app = new Koa();

app.use(bodyParser());

async function githubEvt(ctx, next){
    // TODO 防止重放攻击
    console.log(ctx.body)
    if (ctx.url === "/git") {
        if (ctx.request.body || ctx.request.method === "POST") {
            let requestHash;
            let gitSignature;
            if (GITLAB_TOKEN) {
                requestHash = GITLAB_TOKEN;
                gitSignature = ctx.header['X-Gitlab-Token'];
            }
            if (GITHUB_TOKEN) {
                requestHash = `sha1=${crypto.createHmac('sha1', GITHUB_TOKEN).update(JSON.stringify(ctx.request.body)).digest("hex")}`;
                gitSignature = ctx.header['X-Hub-Signature'];
            }
            // console.log(requestHash);
            if (requestHash === gitSignature) {
                ctx.body = 'Restarting node server!';
                let cmd = execFile("sh", ["start.sh"], (err, stdout, stderr) => {
                    if (err){
                        ctx.status = 503;
                        return ctx.body = `Restarting node server Failed! Error${err}`
                    }
                });
                return;
            }
        } else {
            return ctx.status = 404;
        }
    }
    await next();
}

app.use(githubEvt);

app.listen(3000);
