## Allocations

In Israel, we use an allocation system that gives each Burn Community Entity (e.g. camp, art, etc) an amount of maximum members. This is used as a way to get everyone to participate, and.... mostly because we're not there yet with hosting bigger events.

## Design

We now need to manage a few new things, first of: communities.
(1) Community { allocations: number, name: string, members: Ticket[] }
(2) And change Ticket to reference it's community.

While the excel that will get from the system will probably contain (2) and so we only need to read it, commuities will probably be a different excel that needs to be readed from. (It might be a different sheet, but I'm not sure I won't to complicate the operators but rather manage two files.)
Again, we'll default to some path and assume a JSON of communities is there. Will one day get to let the user to choose with a open file dialog, but we won't do this until way later.

Then, the management of allocations.

Every ticket that becomes isInside: true needs to be ticket.community.usedAllocations++, and vice versa. we'll put in a trpc data transformer. It's a hack, but it'll work.
Also, we need to add validation trpc.ticket.updateStatus that halts when usedAllocations has reached community.totalAllocations. This is a middleware to be added to the tickets router and it'll run depending on a setting which we'll add later, so this boolean setting will be represented by just a const for now.
The client will be made to expect this error, and Toast.show some details to the gatekeeper.

The board will probably want some kind of dashboard, but we won't make the client for it until they ask. For meanwhile, we'll create a class that'll our "analytics" about allocations. Total used allocations from all communities, total available allocations too, and maybe a list of communities, each represented by an objeect with the community name and a used+total allocation properties.
