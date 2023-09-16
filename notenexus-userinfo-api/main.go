package main

import (
	"net/http"

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
	Content string `bson:"content" json:"content"`
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

		router.GET("/users/:id", func(c *gin.Context) {
			getUserByID(c, db)
		})
		router.POST("/users", func(c *gin.Context) {
			insertUser(c, db)
		})
		router.GET("/notes/:id", func(c *gin.Context) {
			getNotesByAuthor(c, db)
		})
		router.POST("/notes", func(c *gin.Context) {
			insertNote(c, db)
		})

		router.Run("localhost:8080")


		// Close the connection when done
		defer client.Disconnect(ctx)
}