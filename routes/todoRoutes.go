package routes

import (
	"github.com/DanSmirnov48/react-with-go/controllers"
	"github.com/DanSmirnov48/react-with-go/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupTodoRoutes(app *fiber.App) {
	todoRouter := app.Group("/api/todos")

	// Apply middleware to ALL Routes hat are defined after that call within the same router or group.
	todoRouter.Use(middleware.GenericMiddleware)

	todoRouter.Get("/", controllers.GetTodos)
	todoRouter.Post("/", controllers.CreateTodo)
	todoRouter.Patch("/:id", controllers.UpdateTodo)
	todoRouter.Delete("/:id", controllers.DeleteTodo)
}
