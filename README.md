Water Tracker App API

To start with the project, create a copy from .env.example file and name it .env
Set up .env:
1. Set up DB connection if you don't use docker
2. Update Cloudinary credentials
3. Update SMTP credentials (For development use Mailtrap account)
4. To geretare a unique token values for `JWT_SECRET` and `CRYPTO_KEY` run this command:
    `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

If you have node installed, use the following commands:
1. `npm run start`: to check how project works
2. `npm run dev`: If you're working with the code

If you have docker:
1. `docker-compose -f docker-compose.yml up --build`: To start development container that would start mongodb and backend servers

Check out API Docs for this RestAPI: