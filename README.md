## LinkedList Project API



**A LinkedIn/AngelList type of clone. Backend created with Node.js, Express, and MongoDB** 

--

### Link to our live API:

[https://linked-listed.herokuapp.com/](https://linked-listed.herokuapp.com/)


####BACKEND REQUIREMENTS FOR THIS PROJECT

* **(Technical)** - The backend should be a fully RESTful API using JSON (see below for a guide of our routes).
* **(Technical) **- The server must be Node.js and Express.js, and the database must be MongoDB.
* **(Technical)** - The API must be built to spec according to Rithm School's documentation on Apiary. Which can be found [here](https://linkedlist.docs.apiary.io/).

####GETTING STARTED

fork the repository https://github.com/Mhowitt/LinkedList-project

	$ git clone https://github.com/Mhowitt/LinkedList-project
	$ cd linkedList
	$ npm install

####ROUTES

The API is composed of three different collections: Users, Companies and Jobs.



CRUD for USERS ~ Collection Endpoint: "/users". Singular Endpoint: "/users/{username}".

See all users, route: "/users", GET Request 

* Implemented Authorization: User Login Required

Add a new user, route: "/users", POST Request

* 	No Authization or Authentication Implemented

See a parrticular user profile, route: "/users/{username}", GET Request

* Implemented Authorization: User Login Required

Update a particular user, route: "/users/{username}", PATCH Request
	
* 	Implemented Authorization: User Login Required
* 	Implemented Authentication: Ensure Correct User
	
Remove a user, route: "/users/{username}", DELETE Request

* 	Implemented Authorization: User Login Required
* 	Implemented Authentication: Ensure Correct User



CRUD for COMPANIES ~ Collection Endpoint: "/companies". Singular Endpoint: "/companies/{companyhandle}".

See all companies, route: "/companies", GET Request 

* Implemented Authorization: User Login Required

Add a new company, route: "/companies", POST Request

* 	No Authization or Authentication Implemented

See a particular company profile, route: "/companies/{companyhandle}", GET Request

* Implemented Authorization: User Login Required or Company Login Required

Update a particular company, route: "/companies/{companyhandle}", PATCH Request
	
* 	Implemented Authorization: Company Login Required
* 	Implemented Authentication: Ensure Correct Company
	
Remove a company, route: "/companies/{companyhandle}", DELETE Request

* 	Implemented Authorization: Company Login Required
* 	Implemented Authentication: Ensure Correct Company



CRUD for JOBS ~ Collection Endpoint: "/jobs". Singular Endpoint: "/jobs/{jodId}".

See all job postings, route: "/jobs", GET Request 

* Implemented Authorization: User Login Required or Company Login Required

Add a new job posting, route: "/jobs", POST Request

* 	Implemented Authorization: Company Login Required
* 	Implemented Authentication: Ensure Correct Company

See a particular job posting, route: "/jobs/{jodId}", GET Request

* Implemented Authorization: User Login Required or Company Login Required

Update a particular job posting, route: "/jobs/{jodId}", PATCH Request
	
* 	Implemented Authorization: Company Login Required
* 	Implemented Authentication: Ensure Correct Company
	
Remove a job posting, route: "/jobs/{jodId}", DELETE Request

* 	Implemented Authorization: Company Login Required
* 	Implemented Authentication: Ensure Correct Company




