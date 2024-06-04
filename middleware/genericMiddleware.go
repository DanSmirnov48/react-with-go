package middleware

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

// GenericMiddleware is a simple middleware that logs requests and checks for errors
func GenericMiddleware(c *fiber.Ctx) error {
	// Log the incoming request
	log.Printf("Request: %s %s", c.Method(), c.OriginalURL())

	// Call the next handler in the chain
	err := c.Next()
	if err != nil {
		// Handle the error, maybe log it
		log.Printf("Error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal Server Error",
		})
	}

	return nil
}
