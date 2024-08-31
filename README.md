# Formaptix Web

This repository contains the source code for the Formaptix Web, as well as a short tutorial on how to run it on the server yourself.

## Guide

### Preparing

* You need to install git to clone the project. You can find a simple guide [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Set up and run the Formaptix Server. You can find a guide in the [Formaptix Server repository](https://github.com/grey-cat-1908/formaptix-server/).
* Install Node.js®. You can find instructions [here](https://nodejs.org/en/download/package-manager).

Clone Formaptix frontend using the following command:

```sh
git clone https://github.com/grey-cat-1908/formaptix-web.git
```

### Configuring

You can configure nearly everything by setting up the following Enviroment Variables:

|  Variable  | Description | Value |
|---|---|---|
| `VITE_APP_NAME`  | You can specify an app name to be displayed in the header and other parts of the website.  | `Formaptix` (default) |
| `VITE_API_URL`  |  You MUST specify Formaptix server url | **required** |

To specify all the enviroment variables you can create `.env` file. You can find `.env` file example [here](https://github.com/grey-cat-1908/formaptix-web/blob/master/.env.example).

### Building

To build project, you should go to the Formaptix Web directory and run the following commands:

```sh
yarn
yarn build
```

### Hosting

You can host a built Formaptix frontend almost anywhere. You just need to host the `build' folder.

I can recommend using something like NGINX or Apache. Or just deploy it using CloudFlare Pages (or some alternative).


- - -

### Note

1. Although the README file is written in English, the site itself currently supports only Russian. There are plans to create website localization in the future.
2. If you suddenly decide to use the project even though you are not from Russia, you will still have to accept the existence of support for local validators (SNILS and TIN).
3. If you are from Russia, CloudFlare Pages may not work properly (`*.pages.dev` may be blocked). You should use an alternative or wait for the release of GitVerse Pages. Or just use a custom domain.

- - -

## Help

If you have any questions or want to get involved in the project in any way, you can use all GitHub instruments (Issues and Pull Requests) or just email me at [email](mailto:mail@mrkrk.me). 

## Acknowledgements

Thanks to my friend Vyacheslav ([flyare](https://github.com/flyare1337)) with frontend and layout design.

## License

Distributed under the terms of the MIT License.
