package com.oraxus.user;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
public class TeamController {
    @QueryMapping
    public Team teamById(@Argument String id) {
        return Team.getById(id);
    }

    @SchemaMapping
    public Member member(Team team) {
        return Member.getById(team.memberId());
    }
}