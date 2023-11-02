import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupBy, setGroupBy] = useState("status");
    const [sortOrder, setSortOrder] = useState("priority");
    const [isOptionsVisible, setOptionsVisible] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch(
                    "https://api.quicksell.co/v1/internal/frontend-assignment"
                );
                const data = await response.json();
                setTickets(data.tickets);
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const getGroupName = (criteria) => {
        if (groupBy === "status") {
            return criteria;
        } else if (groupBy === "priority") {
            switch (criteria) {
                case 0:
                    return "No priority";
                case 1:
                    return "Low";
                case 2:
                    return "Medium";
                case 3:
                    return "High";
                case 4:
                    return "Urgent";
                default:
                    return "Unknown";
            }
        } else if (groupBy === "userId") {
            const user = users.find((user) => user.id === criteria);
            return user ? user.name : "Unknown User";
        }
    };

    const groupTickets = (criteria) => {
        return tickets.reduce((groups, ticket) => {
            const key = ticket[criteria];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(ticket);
            return groups;
        }, {});
    };

    const sortTickets = (groupedTickets) => {
        return Object.keys(groupedTickets).reduce((sorted, key) => {
            sorted[key] = groupedTickets[key].sort((a, b) => {
                if (sortOrder === "priority") {
                    return b.priority - a.priority;
                } else if (sortOrder === "title") {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
            return sorted;
        }, {});
    };

    const groupedAndSortedTickets = sortTickets(groupTickets(groupBy));

    const toggleOptions = () => {
        setOptionsVisible(!isOptionsVisible);
    };

    return ( <
        div className = "kanban-board" >
        <
        div className = "toggle-button" >
        <
        button onClick = { toggleOptions } > Display Options < /button>{" "} <
        /div>{" "} {
            isOptionsVisible && ( <
                div className = "options" >
                <
                div className = "select-container" >
                <
                label className = "select-label" > Grouping: < /label>{" "} <
                select onChange = {
                    (e) => setGroupBy(e.target.value) } >
                <
                option value = "status" > Group by Status < /option>{" "} <
                option value = "userId" > Group by User < /option>{" "} <
                option value = "priority" > Group by Priority < /option>{" "} <
                /select>{" "} <
                /div>{" "} <
                div className = "select-container" >
                <
                label className = "select-label" > Ordering: < /label>{" "} <
                select onChange = {
                    (e) => setSortOrder(e.target.value) } >
                <
                option value = "priority" > Sort by Priority < /option>{" "} <
                option value = "title" > Sort by Title < /option>{" "} <
                /select>{" "} <
                /div>{" "} <
                /div>
            )
        } { " " } <
        div className = "columns" > { " " } {
            Object.keys(groupedAndSortedTickets).map((group) => ( <
                div key = { group }
                className = "column" >
                <
                h3 > { " " } { getGroupName(group) } { groupedAndSortedTickets[group].length } { " " } <
                /h3>{" "} {
                    groupedAndSortedTickets[group].map((ticket) => ( <
                        div key = { ticket.id }
                        className = "card" >
                        <
                        div className = "imageContainer relative"
                        style = {
                            { width: "30px", height: "30px", display: "flex", justifyContent: "flex-end", } } >
                        <
                        img style = {
                            {
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                            }
                        }
                        src = "https://cdn1.vectorstock.com/i/1000x1000/61/50/avatar-business-man-graphic-vector-9646150.jpg"
                        alt = "UserImage" /
                        >
                        <
                        div className = "showStatus" > < /div>{" "} <
                        /div>{" "} <
                        h4 > { ticket.title } < /h4> <p> Status: {ticket.status} </p > { " " } <
                        p > Priority: { ticket.priority } < /p>{" "} <
                        /div>
                    ))
                } { " " } <
                /div>
            ))
        } { " " } <
        /div>{" "} <
        /div>
    );
};

export default App;