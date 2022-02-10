# Contributing

[Oogway](www.oogway.ai) is a DAO (decentralized autonomous organization) and therefore contributions are our lifeblood. We strive to make contributing as seemless as possible and welcome any recommendations on how to improve.

First thing's first, Oogway lives at our [discord server](https://discord.com/invite/GYKDE85pxN). Please join and introduce yourself. If you are here, then you are likely already interested in contributing to the Oogway-Pilot app -- the beta version of our social + evaluate + search ecosystem. Nonetheless, you may discover other ways you can contribute, in addition to, or besides this project. Please take a moment to familiarize yourself with Oogway and our contributor culture.

If you've already done the above and are ready to get working on your first issue, then head down to the Pull Request Process section. Otherwise, below is a brief summary of Oogway's mission and contribution process.

## Oogway's Culture

---

### **Mission**

Our mission is to help people make better decisions. Better decisions lead to better lives.

### **Rules**

1. Be excellent to each other.

### **First Steps**

1. Assign yourself Discord roles that correspond to your skills in the **#role-assignment channel**.
2. Start discussing in **#general**.
3. Explore the list of current development issues on our [Dework Task Board](https://app.dework.xyz/o/oogway-3osNaTPtbSgHHT6ZxzetBl/overview).

Doing this will be the fastest way to get your idea into the pipeline (and potentially attract others who are interested in helping you!).

### **How to contribute**

You'll find that because Oogway's mission is so broad, there are a wide variety of ways to contribute.

**Option 1**: Jump into Discord and make it clear that you want to work on something. We can try to route you, either over text of in the voice chat.

**Option 2**: Go to our [Notion](https://oog.notion.site/Oogway-Home-f4ee1e1bca58404f8088bc7eac36064d), read around a bit, and follow next steps there or come back to one of these other options.

**Option 3**:

1. Suggest ideas (optional): Suggest contribution on suggestions or directly add a suggestion under the “Community Suggestions” column at the [Oogway Task Board](https://bit.ly/3FG3eQY) and wait for it to be moved to the “To Do” column by @Brady, @Federico, or @aniket.
2. Express interest in a ticket: Click on “I’m interested” on a ticket, provide start and end dates for the task and say why you should be on that ticket (e.g. any relevant skills you have). You can also try to join an "In Progress" ticket by messaging the ticket owner (listed as Assignee in the ticket details), in the thread named after the ticket under the dev channel (see "Projects" category) so anyone else involved with the ticket will see and be able to help.
3. Execute: Once the ticket is assigned to you on the Oogway Task Board, it's time to get that ticket done. When you start working on it, move the ticket to “In Progress”. Discuss with anyone else on the ticket (listed in the ticket details) or anyone in the community who you think might be relevant. If there is an owner/lead for the ticket, please follow their lead. You can use our open Google Drive folder if you want to collaborate on Google Docs: https://drive.google.com/drive/folders/1TdjvYOmoHj4ZDzTnMxFfCJRcKvcQYp7s?usp=sharing

Let's build some awesome stuff together and have fun!

## Pull Request Process

---

1. Fork the repo to your own github account (see [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo) for instructions).

2. Set your origin to point to the forked origin rather that the Oogway-technologies one (see [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork) for instructions).
3. Set the upstream to be Oogway-technologies repo (see above link)

    Here's what your remotes should look like:

    ```
    $ git remote -v
    > origin    https://github.com/<your-github-username>/oogway-pilot.git (fetch)
    > origin    https://github.com//oogway-pilot.git (push)
    > upstream  https://github.com/Oogway-Technologies/Oogway-Pilot.git (fetch)
    > upstream  https://github.com/Oogway-Technologies/Oogway-Pilot.git (push)
    ```

4. Create a new branch with the name provided in the Dework ticket details.

    Example: `john/dw-241/update-nav-links-for-social`

5. Prior to pushing PR, rebase your branch onto the most up-to-date version of main and resolve any conflicts.

    The work flow is as follows:

    ```
    $ git checkout main
    $ git fetch upstream
    $ git merge upstream/main
    $ git push origin main [update main branch on your fork]
    $ git checkout <PR-branch-name>
    $ git rebase main
    ```

6. Push your branch to origin: `git push origin <PR-branch-name>`

7. Make a pull request (When pushing to your fork, git will automatically provide you with a link to create a PR on the Oogway-Technologies repo or you can manually navigate there.)

    In the PR, briefly list what changes you made and _why_. If you installed any new dependencies, add the installation command to a list at the bottom, e.g. `npm install react-hook-forms`. Request a recommmended reviewer (currently Evan or Federico).

8. If the reviewer leaves and comments or requests changes, please address them either in writing, code or both. Commit and push any news changes and notify the reviewer, preferrably in the the dedicated discord sub-thread.

9. Continue being awesome!

## Contributor Focus

---

We want to enable a community of contributors to add as much value as possible. If you're a potential contributor, we want to make it as frictionless as possible for you to contribute; hopefully, it'll be much easier than the companies/organizations you might be used to.

We want to have a system that gets the best person for any given job into the place where they need to be to do that job, the best person/people for a given decision into the place to make that decision, etc. We want to get to the point where Oogway contributors feel fulfilled and empowered to reach their potential! If one contributor is consistently pushing the limits of their potential, all Oogway contributors benefit!

We have a channel dedicated to constantly improving this process: **#next-gen-org**. We kindly welcome and and all constructive feedback.
