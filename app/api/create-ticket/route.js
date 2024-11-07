//import axios from "axios";

import { Version3Client } from "jira.js";

import {
  JIRA_API_TOKEN,
  JIRA_BASE_URL,
  JIRA_PROJECT_KEY,
  JIRA_USER_EMAIL,
} from "../../../dataEnv/dataEnv";

import { createNewIssue } from "../../../api/apiIssue";

//import { NextRequest } from "next/server";

export async function GET(req) {
  //console.log("init create-ticket POST...", req);
  if (req.method === "GET") {
    const myUrl = new URL(req.url);
    const myParams = new URLSearchParams(myUrl.searchParams);

    const summary = myParams.get("summary");
    const priority = myParams.get("priority");
    const link = myParams.get("link");
    const userEmail = myParams.get("userEmail");
    const template = myParams.get("template");
    const token = myParams.get("token");
    const objDataTicket = {
      summary: summary,
      priority: priority,
      link: link,
      userEmail: userEmail,
      template: template,
    };

    try {
      const client = new Version3Client({
        host: JIRA_BASE_URL,
        authentication: {
          basic: {
            email: JIRA_USER_EMAIL,
            apiToken: JIRA_API_TOKEN,
          },
        },
      });

      console.log("client:..", client.instanceInformation.getLicense());

      const newIssue = await client.issues.createIssue({
        fields: {
          summary: summary,
          description: JSON.stringify(objDataTicket),
          issuetype: {
            name: "Task",
          },
          project: {
            key: JIRA_PROJECT_KEY,
          },
        },
      });

      console.log("routes newIssue:..", newIssue);

      if (newIssue.id) {
        const dataNewIssue = {
          jiraId: newIssue.id,
          jiraKey: newIssue.key,
          jiraUrl: newIssue.self,
          summary: summary,
          priority: priority,
          link: link,
          userEmail: userEmail,
          template: template,
        };
        const response = await createNewIssue(dataNewIssue, token);
        //eslint-disable-next-line
        console.log("response CreateNewIssueInDB:..", response);
      }

      return new Response(JSON.stringify({ newIssue }), { status: 200 });
    } catch (error) {
      /* res
        .status(error.response?.status || 500)
        .json({ error: "Error creating Jira ticket" }); */
      console.log("Route error", error);

      /* return new Response(JSON.stringify({ error: error.message }), {
        status: error.response?.status || 500,
      }); */
      return new Response(
        JSON.stringify({ error: "Error creating Jira ticket" }),
        {
          status: 500,
        }
      );
    }
  } else {
    //res.setHeader("Allow", ["POST"]);
    //res.status(405).end(`Method ${req.method} Not Allowed`);
    console.log("Method Not Allowed");

    return new Response(
      JSON.stringify({ error: `Method ${req.method} Not Allowed` }),
      {
        status: 405,
      }
    );
  }
}
