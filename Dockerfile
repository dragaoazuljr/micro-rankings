FROM ubuntu

ARG CF_URL

ARG CF_USER

ARG CF_PASSWORD

ARG CF_DEV_ORG

ARG CF_DEV_SPACE

RUN echo $CF_URL

# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN apt-get install -y build-essential libssl-dev

RUN apt-get install -y wget gnupg2

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add -

RUN echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update

RUN apt-get install cf-cli

RUN cf version

#install node

RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -

RUN apt-get -y install nodejs

RUN node --version

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

RUN cp package.json dist/package.json

RUN cf login -a $CF_URL -u $CF_USER -p $CF_PASSWORD -o $CF_DEV_ORG -s $CF_DEV_SPACE

RUN cf push

#CMD ["node", "dist/main"]