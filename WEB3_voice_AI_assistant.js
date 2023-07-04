// {Name: Basic_example_for_voice_AI_assistant}
// {Description: Learn how to create a dialog script and integrate your AI assistant with the app}

onCreateUser(p => {
    p.userData.isVerified = (null);
});

// Use this sample to create your own voice commands
intent('hello', p => {
    p.play('(hi there,I am your blockchain intelligent voice assistant. Please verify your reserved voiceprint password.)');
    p.then(speakerVerification);
});



let speakerVerification = context(() => {
    intent('my password is $(W* .+)', p => {
        if(p.W.value === '2252' || p.W.value === '1122' || p.W.value === '1133') {
            if(p.W.value === '2252'){
                p.play('Welcome,boyu!Your wallet has been bound.')
                p.userData.isVerified = ('boyu')
            } else if (p.W.value === '1122') {
                p.play('Welcome,alice!Your wallet has been bound.')
                p.userData.isVerified = ('alice')
            } else if (p.W.value === '1133') {
                p.play('Welcome,bob!Your wallet has been bound.')
                p.userData.isVerified = ('bob')
            } else if (p.W.value === '1144') {
                p.play('Welcome,david!Your wallet has been bound.')
                p.userData.isVerified = ('david')
            }
            console.log(p.userData.isVerified);
            p.then(transferVerification);
        } else{
            p.play('Dear user, you need to bind your wallet before being allowed to use it.')
        }
    });
    
});

let transferVerification = context(() => {
    intent('Transfer $(W* .+) to $(USER boyu|bob|david|alice)', p => {
        console.log(p.userData.isVerified);
        console.log(p.W.value)
        console.log(p.USER.value)
        p.play({ command: 'transfer', data: {fromUser: p.userData.isVerified, toUser: p.USER.value, num: p.W.value}});
    });
    
    intent('Check my balance', p => {
        console.log(p.userData.isVerified);
        p.play({ command: 'checkBalance', data: {user: p.userData.isVerified}});
    });
});


// intent('What do you have?', p => {
//     p.play('I can offer you a pizza or a burger');
//     p.then(chooseDish);
// });

// let chooseDish = context(() => {
//     intent('Get me a $(D pizza|burger)', p => {
//         p.play(`Your order is: ${p.D.value}. Is it correct?`);
//         p.then(confirmOrder);
//     })
// });

let confirmOrder = context(() => {
    intent('Yes', p => {
        p.play('Your order has been confirmed');
    });

    intent('No', p => {
        p.play('Your order has been cancelled');
    });
});


// Give Alan some knowledge about the world
corpus(`
    Hello, I'm Alan.
    This is a demo application.
    You can learn how to teach Alan useful skills.
    I can teach you how to write Alan Scripts.
    I can help you. I can do a lot of things. I can answer questions. I can do tasks.
    But they should be relevant to this application.
    I can help with this application.
    I'm Alan. I'm a virtual assistant. I'm here to help you with applications.
    This is a demo script. It shows how to use Alan.
    You can create dialogs and teach me.
    For example: I can help navigate this application.
`);