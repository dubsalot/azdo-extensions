const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Hubs" folder and add an entry for each one
const hubsDir = path.join(__dirname, "src/Hubs");
fs.readdirSync(hubsDir).filter(dir => {
    if (fs.statSync(path.join(hubsDir, dir)).isDirectory()) {
        console.log(`dir: ${path.relative(process.cwd(), path.join(hubsDir, dir, dir))}`);
        entries[dir] = "./" + path.relative(process.cwd(), path.join(hubsDir, dir, dir));
    }
});

function logBanner(msg) {
    let m = 191;
    if(process.stdout.columns == undefined)
    {
        m = 191;
    }
    else
    {
        m = process.stdout.columns + 1;
    }
    var bar = Array(m).join('-');
    //change color
    console.log("\x1b[32m");
    
    console.log("\x1b[34m"+bar+"\x1b[0m");
    console.log("\x1b[34m"+msg+"\x1b[0m");
    console.log("\x1b[34m"+bar+"\x1b[0m");

    //reset
    console.log("\x1b[0m");
}


function addComponmentAliass(componentsdir, aliasName)  {
    let aliasArray = [];
    
    logBanner(`Finding aliases: ${aliasName}  ->  ${componentsdir}`);

    let files = getTsxFilesForAlias(componentsdir, []);

    const regex = /\\/gi;

    console.log(`Creating aliases for files in ${componentsdir}`);
    files.forEach(f=>{
        let componentname = f.replace(componentsdir, "@components").replace(regex, "/");
        let a = {name: componentname, value: f};
        aliasArray.push(a);
        console.log(`   \x1b[32m ${a.name} \x1b[0m ->  ${a.value}`);
    });
    return aliasArray;
}


function getTsxFilesForAlias(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getTsxFilesForAlias(dirPath + "/" + file, arrayOfFiles)
        } else {
            let f = path.join(dirPath, file);
            if(f.toLowerCase().endsWith(".tsx"))
            {
                arrayOfFiles.push(f.replace('.tsx', ''));
            }
        }
    })
    return arrayOfFiles;
}

module.exports = env => {
    return {
        entry: entries,
        devServer: {
            contentBase: path.join(__dirname, '/dist'),
            compress: true,
            port: 8080            
        },
        output: {
            filename: "[name]/[name].js"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: getAliases(env),
        },
        stats: {
            warnings: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", "azure-devops-ui/buildScripts/css-variables-loader", "sass-loader"]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.woff$/,
                    use: [{
                        loader: 'base64-inline-loader'
                    }]
                },
                {
                    test: /\.html$/,
                    loader: "file-loader"
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([{ from: "**/*.html", context: "src/Hubs" }])
        ]
    };
};

function getAliases(env) {
    let list = addComponmentAliass(path.join(__dirname, "src/components"), '@components');

    var alias_g = {
        "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk"),
        "@serviceinterfaces": path.resolve("src/Services/Interfaces/IServiceInterfaces"),
    };

    if(list && list.length > 0)
    {
        list.forEach(a=> {
            alias_g[a.name] = a.value
        });
    }

    if (env.useFakes == "true") {
        logBanner("Creating build with MOCK implementations");
        alias_g["@locatorpath"] = path.resolve("src/Services/Fakes/Locator");
    }
    else {
        logBanner(" !!! Creating build with REAL implementations !!! ");
        alias_g["@locatorpath"] = path.resolve("src/Services/Implementations/Locator");
    }
    return alias_g;
}


