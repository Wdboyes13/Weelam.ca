package ca.weelam

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.plugins.hsts.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/secret") {
            call.respondRedirect("https://youtu.be/dQw4w9WgXcQ")
        }
        get("/github/profile") {
            call.respondRedirect("https://github.com/Wdboyes13/")
        }
        get("/games/devwordle.weelam.ca") {
            call.respondRedirect("https://devwordle.weelam.ca")
        }
        get("/github/{repo}") {
            val repo = call.parameters["repo"]
            if (repo != null) {
                call.respondRedirect("https://github.com/Wdboyes13/$repo")
            } else {
                call.respondText("Missing repo parameter", status = io.ktor.http.HttpStatusCode.BadRequest)
            }
        }
        staticResources("/", "www")
    }
}
