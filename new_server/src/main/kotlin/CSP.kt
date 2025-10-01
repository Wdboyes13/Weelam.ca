package ca.weelam

import io.ktor.server.application.*
import io.ktor.server.plugins.defaultheaders.*

fun Application.configureCSP() {
    install(DefaultHeaders) {
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
}

fun buildCSP(block: CSPBuilder.() -> Unit): String {
    val builder = CSPBuilder()
    builder.block()
    return builder.toString()
}

class CSPBuilder {
    private val directives = mutableMapOf<String, MutableList<String>>()

    private fun addDirective(name: String, vararg values: String) {
        directives.getOrPut(name) { mutableListOf() }.addAll(values)
    }

    fun defaultSrc(vararg v: String) = addDirective("default-src", *v)
    fun scriptSrc(vararg v: String) = addDirective("script-src", *v)
    fun styleSrc(vararg v: String) = addDirective("style-src", *v)
    fun imgSrc(vararg v: String) = addDirective("img-src", *v)
    fun connectSrc(vararg v: String) = addDirective("connect-src", *v)
    fun fontSrc(vararg v: String) = addDirective("font-src", *v)
    fun objectSrc(vararg v: String) = addDirective("object-src", *v)
    fun frameAncestors(vararg v: String) = addDirective("frame-ancestors", *v)
    fun frameSrc(vararg v: String) = addDirective("frame-src", *v)
    fun mediaSrc(vararg v: String) = addDirective("media-src", *v)

    override fun toString(): String =
        directives.entries.joinToString("; ") { (k, v) -> "$k ${v.joinToString(" ")}" }
}