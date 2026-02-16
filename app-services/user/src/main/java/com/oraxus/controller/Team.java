package com.oraxus.user;

import java.util.Arrays;
import java.util.List;

public record Team (String id, String name, String memberId) {

    private static List<Team> teams = Arrays.asList(
            new Team("team1", "Vikings-HT", "player1"),
            new Team("team2", "Vikings-PL", "player2"),
            new Team("team3", "Vikings-T20", "player3")
    );

    public static Team getById(String id) {
        return teams.stream()
                .filter(team -> team.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}