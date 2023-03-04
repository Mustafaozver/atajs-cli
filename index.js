#!/usr/bin/env node
((ATA)=>{
	const CP = ATA.Require("child_process");
	const Path = ATA.Require("path");
	const FS = ATA.Require("fs");
	const Request = ATA.Require("request");
	
	const args = process.argv;
	const env = process.env;
	
	const projectFolder = ATA.CWD;
	
	const ClearScrean = ()=>{
		process.stdout.write('\u001B[2J\u001B[0;0f');
	};
	const ClearLine = ()=>{
		const CSI = '\u001B[';
		process.stdout.write(CSI + 'A' + CSI + 'K');
	};
	const GetScreenSize = ()=>{
		return{
			w: process.stdout.columns,
			h: process.stdout.rows
		};
	};
	const SetCursorPosition = (x, y)=>{
		process.stdout.cursorTo(x, y, ()=>{});
	};
	const SetProgressBar = (x=0, msg="")=>{
		ClearLine();
		let em = "░";
		let fu = "█"
		let text = "";
		const limit = 40;
		for(let i=0;i<limit;i++){
			if((i/limit) > x) text += em;
			else text += fu;
		}
		text += " " + (100*x).toFixed(2) + "% " + msg;
		process.stdout.write(text + "\n");
	};
	const DownLoadFile = async (url)=>{
		const data = await new Promise((resolve, reject)=>{
			const fileData = Path.parse(url);
			const fileName = fileData.name + fileData.ext;
			const outStream = FS.createWriteStream(fileName);
			let received_bytes = 0;
			let total_bytes;
			Request.get(url)
			.on("error", ()=>{
				reject();
			})
			.on("response", (data)=>{
				total_bytes = parseInt(data.headers["content-length"]);
				SetProgressBar(0, "starting...");
			})
			.on("data", (data)=>{
				received_bytes += data.length;
				SetProgressBar(received_bytes/total_bytes, fileName + " downloading...");
				//if(received_bytes == total_bytes)resolve(true);
			})
			.on("end", ()=>{
				ClearLine();
				process.stdout.write("> " + fileName + " downloaded.\n\n");
				resolve(true);
			})
			.pipe(outStream);
		});
		return data;
	};
	const CommandPrompt = (comm)=>{
		const command = ("" + comm).split(" ");
		CP.spawn(command.shift(), command, {cwd: projectFolder, encoding: 'utf8', env:{}});
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Tasks
	(async()=>{
		//return;
		
		const package_json = ATA.Require(Path.join(projectFolder, "package.json"));
		ClearScrean();
		SetCursorPosition(0, 0);
		console.log(projectFolder);
		console.log(GetScreenSize());
		console.log("Tamamdır", __dirname, package_json);
		console.log(args[2]);
		ATA.GLOBAL.Exit();
	})();
	return{
		
	};
})(require("ata.js")());