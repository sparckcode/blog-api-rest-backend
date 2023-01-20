# BLOG | Back-end - API REST

To run the application it is necessary to install the dependencies using the following command:

    npm install
  
For the configuration of the project, it is necessary to create the following folders to save the images that you want to upload:

    src\assets\image-articles
## Routes

### POST
 - http://localhost:3300/api/create-article
	 - Create a article:
		 - `{"title":"An title for your article", "content":"An text for your article"}`
 - http://localhost:3300/api/create-article/:id
	 - Upload an image to article.
	 - :id -> Article id
	 - file: param from form-data, file type.
