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

fun Application.configureHTTP() {
    install(HSTS) {
        includeSubDomains = true
    }
    install(DefaultHeaders) {
        header("X-Engine", "Ktor") // will send this header with each response
        header("X-Content-Type-Options", "nosniff")
        header("X-Frame-Options", "SAMEORIGIN")
        header("Referrer-Policy", "strict-origin-when-cross-origin")
        header("X-SuperSecret", "https://youtu.be/dQw4w9WgXcQ")
	header(
            "Content-Security-Policy",
            buildCSP {
                defaultSrc("'self'")
                scriptSrc("'self'", "https://esm.run", "https://fonts.googleapis.com",
                          "https://static.cloudflareinsights.com", "https://cdn.jsdelivr.net", "'unsafe-inline'")
                styleSrc("'self'", "https://esm.run", "https://fonts.googleapis.com")
                imgSrc("'self'", "https://esm.run", "https://fonts.googleapis.com", "https://img.pagecloud.com")
                connectSrc("'self'")
                fontSrc("'self'", "https://esm.run", "https://fonts.googleapis.com", "https://fonts.gstatic.com")
                objectSrc("'none'", "https://esm.run", "https://fonts.googleapis.com")
                frameAncestors("'self'", "https://open.spotify.com")
                frameSrc("https://open.spotify.com")
                mediaSrc("https://weelam.ca")
            }
        )
    }
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }
}
