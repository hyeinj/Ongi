package com.ongi.backend.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class ResponseDTO<T> {
    private final boolean success;
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    public static <T> ResponseDTO<T> success(String message, T data) {
        ResponseDTO<T> response = new ResponseDTO<>(true);
        response.setData(data);
        response.setMessage(message);
        return response;
    }

    public static ResponseDTO<?> error(String message) {
        ResponseDTO<?> response = new ResponseDTO<>(false);
        response.setMessage(message);
        return response;
    }
}
