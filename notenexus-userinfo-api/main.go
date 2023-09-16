package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type user struct {
	Id string `bson:"id" json:"id"`
	Name string `bson:"name" json:"name"`
	Email string `bson:"email" json:"email"`
}

type note struct {
	Id string `bson:"id" json:"id"`
	Title string `bson:"title" json:"title"`
	Summary string `bson:"summary" json:"summary"`
	Author string `bson:"author" json:"author"`
}

func getNotesByAuthor(c *gin.Context, db *mongo.Database) {
	id := c.Param("id")

	// query mongodb for notes where author = id
	notes := db.Collection("notes")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var results []note
	cursor, err := notes.Find(ctx, bson.M{"author": id})
	if err != nil {
		fmt.Println(err);
		// exit 
		c.JSON(http.StatusNotFound, gin.H{
			"status": http.StatusNotFound,
			"message": "User not found",
		})
		return
	}

	if err = cursor.All(ctx, &results); err != nil {
		log.Fatal(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "Notes found",
		"data": results,
	})
}

func deleteNoteByID(c *gin.Context, db *mongo.Database) {
	id := c.Param("id")

	notes := db.Collection("notes")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	_, err := notes.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		fmt.Println(err);
		// exit 
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"message": "Failed to delete note",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "Note deleted successfully",
	})
}

func updateNoteByID(c *gin.Context, db *mongo.Database) {
	id := c.Param("id")

	// Decode the incoming JSON request body into the note struct
	var updatedNote note
	if err := c.BindJSON(&updatedNote); err != nil {
		c.JSON(400, gin.H{"error": "Failed to bind note"})
		return
	}

	notes := db.Collection("notes")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Define a filter to identify the document to update based on the ID
	filter := bson.M{"id": id}

	// Define an update document to set the new values
	update := bson.D{
		{Key: "$set", Value: bson.D{
			{Key: "title", Value: updatedNote.Title},
			{Key: "summary", Value: updatedNote.Summary},
			{Key: "author", Value: updatedNote.Author},
		}},
	}

	// Call the UpdateByID method with the necessary parameters
	_, err := notes.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update note"})
		return
	}

	c.JSON(200, gin.H{"message": "Note updated successfully"})
}


func getUserByID(c *gin.Context, db *mongo.Database) {
	id := c.Param("id")

	// query mongodb for user with id = id
	users := db.Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var result user
	err := users.FindOne(ctx, bson.M{"id": id}).Decode(&result)
	if err != nil {
		fmt.Println(err);
		// exit 
		c.JSON(http.StatusNotFound, gin.H{
			"status": http.StatusNotFound,
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "User found",
		"data": result,
	})
}

func insertUser(c *gin.Context, db *mongo.Database) {
	var newUser user
	err := c.BindJSON(&newUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}
	// enforce new user to have id
	if newUser.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"message": "User must have id",
		})
		return
	}


	users := db.Collection("users")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	// enforce new user id to be unique
	var result user
	err = users.FindOne(ctx, bson.M{"id": newUser.Id}).Decode(&result)
	if err == nil {
		fmt.Println(err);
		// exit
		c.JSON(http.StatusConflict, gin.H{
			"status": http.StatusConflict,
			"message": "User already exists",
		})
		return
	}

	insertResult, err := users.InsertOne(ctx, newUser)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a single document: ", insertResult.InsertedID)

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "User added",
		"data": insertResult,
	})
}

func insertNote(c *gin.Context, db *mongo.Database) {
	var newNote note
	err := c.BindJSON(&newNote)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"message": "Invalid request body",
		})
		return
	}

	notes := db.Collection("notes")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	insertResult, err := notes.InsertOne(ctx, newNote)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Inserted a single document: ", insertResult.InsertedID)

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "Note added",
		"data": insertResult,
	})
}

func getNoteById(c *gin.Context, db *mongo.Database) {
	id := c.Param("id")

	// query mongodb for note with id = id
	notes := db.Collection("notes")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var result note
	err := notes.FindOne(ctx, bson.M{"id": id}).Decode(&result)
	if err != nil {
		fmt.Println(err);
		// exit 
		c.JSON(http.StatusNotFound, gin.H{
			"status": http.StatusNotFound,
			"message": "Note not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": http.StatusOK,
		"message": "Note found",
		"data": result,
	})
}
func main() {
    // Set client options
    clientOptions := options.Client().ApplyURI("mongodb+srv://maxnaegel:vA8MqUgftaQJLE4G@vA8MqUgftaQJLE4Gcluster0.hx5mprc.mongodb.net/")


    // Connect to MongoDB
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Check the connection
    ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

		db := client.Database("nexusnotes")
		db.Client().Ping(ctx, nil)

    fmt.Println("Connected to MongoDB!")

		router := gin.Default()
		config := cors.DefaultConfig()
    config.AllowAllOrigins = true
    router.Use(cors.New(config))
		
		router.GET("/users/:id", func(c *gin.Context) {
			getUserByID(c, db)
		})
		router.POST("/users", func(c *gin.Context) {
			insertUser(c, db)
		})
		router.GET("/notes/users/:id", func(c *gin.Context) {
			getNotesByAuthor(c, db)
		})
		router.GET("/notes/:id", func(c *gin.Context) {
			getNoteById(c, db)
		})
		router.POST("/notes", func(c *gin.Context) {
			insertNote(c, db)
		})
		router.DELETE("/notes/:id", func(c *gin.Context) {
			deleteNoteByID(c, db)
		})
		router.PATCH("/notes/:id", func(c *gin.Context) {
			updateNoteByID(c, db)
		})

		router.Run("localhost:8080")


		// Close the connection when done
		defer client.Disconnect(ctx)
}