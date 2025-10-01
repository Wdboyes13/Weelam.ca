package ca.weelam

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*
import io.ktor.server.plugins.hsts.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.engine.cio.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import ca.weelam.ConvertRequest

@Serializable
data class ConvertRequest(val from: String, val to: String, val amnt: String)

fun Application.configureSerialization() {
    val client = HttpClient(CIO)
    install(ContentNegotiation) {
        json()
    }
    routing {
        post("/cconv/convert") {
            val req = call.receive<ConvertRequest>()
            val amount = req.amnt.toDouble()
            
            val apiResponse: String = client.get("https://api.frankfurter.dev/v1/latest") { 
                url {
                    parameters.append("base", req.from)
                    parameters.append("symbols", req.to)
                }
            }.body()

            val json = Json.parseToJsonElement(apiResponse).jsonObject
            val rate = json["rates"]!!.jsonObject[req.to]!!.toString().toDouble()
            val converted = String.format("%.2f", amount * rate)

            call.respondText(
                """
                <!DOCTYPE html><html><head><title>Result</title></head><body><script>
                    document.addEventListener("DOMContentLoaded", () => {
                        alert("$amount ${req.from} is $converted ${req.to}");
                        window.location.href="/cconv";
                    });
                </script></body></html>
                """.trimIndent(),
                ContentType.Text.Html
            )
        }
    }
}
