package com.oraxus.user;

import java.util.Arrays;
import java.util.List;

public record Member(String id, String firstName, String lastName) {

    private static List<Member> members = Arrays.asList(
            new Member("player1", "sathish", "kumar"),
            new Member("player2", "Murali", "shanmugam"),
            new Member("player3", "Vasanth", "lion"),
            new Member("player4", "Vinod", "Mulla")
    );

    public static Member getById(String id) {
        return members.stream()
                .filter(member -> member.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}