package com.ongi.backend.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {
    @GetMapping("/test")
    public String test() { return "Hello World!";    }
}
