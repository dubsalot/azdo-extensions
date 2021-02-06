# Introduction 
This project is an extension for [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/) henceforth referred to as azdo or AzDo. The goal is to consolidate some of the azdo screens into one hub. AzDo is a great product made out of 100% awesome, *but* I find navigating some of the screens that I use all day everyday to be annoying. Granted, some of this is because of the way my company organizes and names its projects.

For example, we have 80 applications in my department. Each one has a repository, a release definition, and a build definition. We are using the classic builds/releases. The are all named with their "app code" which is a thing internal to my company. An example might be WMABC. Thefore, I will have a repo, a build defintion, and a release definition named WMABC along with 79 other applications. Each section in AzDo has it's own UI where a user can search for what they are looking for. 

It all starts blurring together, honestly. Granted, this is a personal preference, I'd rather have those things in one place with one search box. That's the primary goal of the extension.

### Screenshot
![extension screenshot](docs/screens/screenshot.png)


# Getting Started
When I create a codebase, one of my goals is for others to be able to pull the code and "hit the green play button" and have everything just work.
I'm not sure how close I am with this codebase, but that goal hasn't been a priority since I'm the only person developing on it. 

I think it's close. Try these steps:

1. clone the repo
2. cd pipelines
3. npm run local

*Note*: Developing azdo extensions, and more specifically debugging them, is kind of wonky.The extension _has_ to run inside a azdo context. I am experimenting with "mocking" this for local development and debugging.

It is very crude and very clunky, but has helped me a good bit.

There is an alternative method to build which involves setting an iframe to "localhost" and publishing the extension the marketplace. I haven't done than in some time, and it may be a better experience now. At the time, I found it to be cumbersome. Granted - I had no idea what I was doing then.



# Contribute
I might opensource this thing one day and make the extension public. 

# Links
These are some random links that I keep in a bookmark folder on my dev machine. I haven't bothered titling them here because I assume you will bookmark them if you find them useful.

https://docs.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=azure-devops#:~:text=Every%20extension%20has%20a%20JSON,your%20extensions%20to%20Azure%20DevOps.&text=Check%20out%20our%20newest%20documentation,the%20Azure%20DevOps%20Extension%20SDK.
https://docs.microsoft.com/en-us/javascript/api/azure-devops-extension-sdk/
https://developer.microsoft.com/en-us/azure-devops/develop/styles
https://developer.microsoft.com/en-us/azure-devops/
https://developer.microsoft.com/en-us/azure-devops/components
https://developer.microsoft.com/en-us/azure-devops/components/filter
https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
https://developer.microsoft.com/en-us/fluentui#/controls/web/icon
https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
https://docs.microsoft.com/en-us/azure/devops/extend/publish/overview?view=azure-devops
https://docs.microsoft.com/en-us/javascript/api/azure-devops-extension-api/?view=azdevops-ext-latest
https://docs.microsoft.com/en-us/azure/devops/extend/develop/work-with-urls?view=azure-devops&tabs=http#how-to-get-an-organizations-url


### quick note
if you look at my commit history, you might notice a PAT from azdo in the repo. It is expired. I know this is bad practice. Keep in mind this has only been for my personal use and development. The pipeline I have that publishes this extension to the market place has the real token in a secret variable. 



:rocket: Happy Coding!
