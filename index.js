const crypto = require('crypto');
const execFile = require('child_process').execFile;
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const GITLAB_TOKEN = process.env._GITLAB_SECRET;
const GITHUB_TOKEN = process.env._GITHUB_SECRET;

const app = new Koa();

app.use(bodyParser());

async function githubEvt(ctx, next){
    //
    let requestHash;
    let gitSignature;
    debugger;
    console.log(GITLAB_TOKEN, GITHUB_TOKEN);
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
        let cmd = execFile("sh", ["start.sh"], (err, stdout, stderr) => {
            if (err){
                return ctx.body = `Error${err}`
            }
            ctx.body +=  (err + stdout + stderr)
        });
        // console.log(cmd)
        return;
    }
    await next();
}

app.use(githubEvt);

app.listen(3000);
