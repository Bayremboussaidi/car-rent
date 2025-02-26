package com.example.comparateur.config;

import java.util.List;

import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * Interface for configuring message brokers in WebSocket applications.
 */
public interface WebSocketMessageBrokerConfigurer {

    /**
     * Register STOMP endpoints mapping each to a specific URL.
     *
     * @param registry the STOMP endpoint registry
     */
    default void registerStompEndpoints(StompEndpointRegistry registry) {}

    /**
     * Configure the message broker options.
     *
     * @param registry the message broker registry
     */
    default void configureMessageBroker(MessageBrokerRegistry registry) {}

    /**
     * Configure the list of argument resolvers to support custom method arguments.
     *
     * @param argumentResolvers the argument resolver list
     */
    default void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {}

    /**
     * Configure the list of message converters to support custom data types.
     *
     * @param messageConverters the list of message converters
     * @return {@code true} if default converters should be used, otherwise {@code false}
     */
    default boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        return true;
    }
}
