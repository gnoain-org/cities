# Cities App
Simple Angular and Node test app to manage a list of cities and its businesses

## Considerations
The app has some aspects that should be improved in further iterations:
 * Proper error management and exception handling in the front end
 * Front end unit test coverage
 * Add Grunt/Gulp tasks for shipping the front end code correctly.
 * Use of https server
 * Use nginx or similar as a reverse proxy and static file server so the back end and front end code can be separated.
 * Incorporate a proper devops process

## Setup
Before running, install dependencies
```sh
npm install
```
and
```sh
bower install
```
Create a .env file in the root folder for the following back end environment variables:
```sh
NODE_ENV= #The current environment to run the app in (e.g development)

IP= #Server IP (e.g localhost)
PORT= #Server Port (e.g 9000)
```
## Usage

Run the app by executing
```sh
npm start
```
Open the browser in the URL specified by the process (e.g. `http://localhost:9000`)

## Tests

Currently front end and back end unit tests have to be run independently
### Back End Tests
```sh
npm test
```
### Front End Tests
```sh
karma start
```

## License

MIT
