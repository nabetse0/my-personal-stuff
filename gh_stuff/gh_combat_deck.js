function shuffle(arr) {
    for (let ii = arr.length - 1; ii > 0; ii--) {
        let jj = Math.floor(Math.random() * ii);
        let tmp = arr[ii];
        arr[ii] = arr[jj];
        arr[jj] = tmp;
    }
    return arr;
}

const ModifierType = {
    NEG_TWO: "-2",
    NEG_ONE: "-1",
    ZERO: "+0",
    ONE: "+1",
    TWO: "+2",
    CRIT: "2X",
    NULL: "~null~"
}
Object.freeze(ModifierType);

const ConditionType = {
    NONE: "",
    MUDDLE: "muddle",
    POISON: "poison",
    WOUND: "wound", 
    IMMOBILIZE: "immobilize",
    STUN: "stun",
    CURSE: "curse",
    ADD_TARGET: "target-one-more", 
}
Object.freeze(ConditionType);

function Condition(condition) {
    this.condition = condition;
}

Condition.prototype.toString = function conditionToString() {
    return `${this.condition}`;
}

const SpecialCardType = {
    NONE: "",
    BLESSING: "BLESSING",
    CURSE: "CURSE"
}
Object.freeze(SpecialCardType);

function SpecialCard(special) {
    this.special = special;
}

SpecialCard.prototype.toString = function specialToString() {
    return `${this.special}`;
}

function Card(modifier=ModifierType.ZERO,
              rolling=false,
              condition=ConditionType.NONE,
              reshuffle=false,
              special=SpecialCardType.NONE) {
    this.modifier = modifier;
    this.rolling = rolling;
    this.condition = condition;
    this.reshuffle = reshuffle;
    this.special = special;
}

Card.prototype.toString = function cardToString() {
    let num_str = `${this.modifier}`;
    let rolling_str = this.rolling ? "[rolling]" : "";
    let condition_str = this.condition ? `[${this.condition}]` : "";
    let reshuffle_str = this.reshuffle ? "RESHUFFLE" : "";
    let special_str = this.special ? `<${this.special}>` : "";
    return `    ${num_str} ${rolling_str} ${condition_str} ${reshuffle_str} ${special_str}`
}

// TODO: Convert this to toHtml()
//       Move display() functionality to Deck
Card.prototype.toHtml = function cardToHtml() {
    let num_str = `    ${this.modifier}`;
    let rolling_str = this.rolling ? " [rolling]" : "";
    let condition_str = this.condition ? ` [${this.condition}]` : "";
    let reshuffle_str = this.reshuffle ? " RESHUFFLE" : "";
    let special_str = this.special ? ` <${this.special}>` : "";


    var p = document.createElement("p");

    function add_card_attr(desc, cls) {
        mark = document.createElement("mark");
        mark.append(document.createTextNode(desc));
        mark.classList.add(cls);
        p.append(mark);
    }

    p.append(document.createTextNode("\u00A0\u00A0\u00A0\u00A0"));

    add_card_attr(num_str, "modifier");
    add_card_attr(rolling_str, "rolling");
    add_card_attr(condition_str, "condition");
    add_card_attr(reshuffle_str, "reshuffle");
    add_card_attr(special_str, "special");
    
    p.classList.add("card");
    return p;
}

Card.prototype.isOneTimeUse = function cardIsOneTimeUse() {
    return this.special ? true : false;
}

const BASIC_DECK = [
    // Basic combat deck
    {modifier: ModifierType.NULL, rolling: false, condition: ConditionType.NONE, reshuffle: true, special: SpecialCardType.NONE},
    {modifier: ModifierType.NEG_TWO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.NEG_ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.NEG_ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.NEG_ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.NEG_ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.NEG_ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    // {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.TWO, rolling: false, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.CRIT, rolling: false, condition: ConditionType.NONE, reshuffle: true, special: SpecialCardType.NONE},
    // Additions
    {modifier: ModifierType.ONE, rolling: true, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: true, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: true, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ONE, rolling: true, condition: ConditionType.NONE, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ZERO, rolling: true, condition: ConditionType.ADD_TARGET, reshuffle: false, special: SpecialCardType.NONE},
    {modifier: ModifierType.ZERO, rolling: false, condition: ConditionType.STUN, reshuffle: false, special: SpecialCardType.NONE},
]


function Deck(target_elem, card_configs=BASIC_DECK, cards_to_show=15) {
    this.target_elem = target_elem;
    this.card_configs = [...card_configs];
    this.playable_indices = [...Array(this.card_configs.length).keys()];
    this.to_be_removed = [];
    this.played = [];
    this.shuffled_indices = shuffle([...this.playable_indices]);
    this.k = 0;
    this.cards_to_show = cards_to_show;
    this.num_cards_in_play = this.playable_indices.length;
}

Deck.prototype.shuffle = function deckShuffle() {
    // Remove indices to cards that have been marked for removal
    for (let ii = 0; ii < this.to_be_removed.length; ii++) {
        this.playable_indices = this.playable_indices.filter(idx => idx !== this.to_be_removed[ii]);
    }

    this.shuffled_indices = shuffle([...this.playable_indices]);
    this.k = 0;
    this.num_cards_in_play = this.playable_indices.length;
};

Deck.prototype.undo = function deckUndo() {
    if (this.k > 0) {
        this.k--;
        this.target_elem.removeChild(this.target_elem.firstChild);
        if (this.played.length > this.cards_to_show) {
            this.target_elem.append(this.played[this.played.length - this.cards_to_show - 1].toHtml());
        }
        this.played.pop();
    }
};

Deck.prototype.deal = function deckDeal() {
    let conf = this.card_configs[this.shuffled_indices[this.k]];
    if (!conf) {
        var p = document.createElement("p");
        p.append(document.createTextNode("E M P T Y\u00A0\u00A0\u00A0\u00A0D E C K !"));
        this.target_elem.prepend(p);
        this.k++;
        return;
    }

    let c = new Card(conf.modifier, conf.rolling, conf.condition, conf.reshuffle, conf.special);
    if (c.isOneTimeUse()) {
        this.to_be_removed.push(this.shuffled_indices[this.k]);
    }

    let card_elem = c.toHtml();
    mark = document.createElement("mark");
    mark.append(document.createTextNode(`${this.k + 1}/${this.num_cards_in_play}:\u00A0`));
    mark.classList.add("counter");
    card_elem.prepend(mark);
    
    this.target_elem.prepend(card_elem);

    // while (this.target_elem.childElementCount > this.cards_to_show) {
    //     this.target_elem.removeChild(this.target_elem.lastChild);
    // }

    this.k++;
    this.played.push(c);
};

Deck.prototype.addBlessing = function deckAddBlessing() {
    this.card_configs.push({
        modifier: ModifierType.CRIT,
        rolling: false,
        condition: ConditionType.NONE,
        reshuffle: false,
        special: SpecialCardType.BLESSING
    })

    let new_idx = this.card_configs.length - 1;
    this.playable_indices.push(new_idx);
    this.shuffled_indices.push(new_idx);
    this.shuffled_indices.splice(this.k,
                                 this.num_cards_in_play - this.k + 1,
                                 ...shuffle(this.shuffled_indices.slice(this.k)));
};

Deck.prototype.addCurse = function deckAddCurse() {
    this.card_configs.push({
        modifier: ModifierType.NULL,
        rolling: false,
        condition: ConditionType.NONE,
        reshuffle: false,
        special: SpecialCardType.CURSE
    })

    let new_idx = this.card_configs.length - 1;
    this.playable_indices.push(new_idx);
    this.shuffled_indices.push(new_idx);
    this.shuffled_indices.splice(this.k,
                                 this.num_cards_in_play - this.k + 1,
                                 ...shuffle(this.shuffled_indices.slice(this.k)));
};

Deck.prototype.show = function deckShow(card) {
    if (card) {
        this.target_elem.prepend(card.toHtml());
    } else {
        var p = document.createElement("p");
        p.append(document.createTextNode("E M P T Y\u00A0\u00A0\u00A0\u00A0D E C K !"));
        this.target_elem.prepend(p);
    }

    while (this.target_elem.childElementCount > this.cards_to_show) {
        this.target_elem.removeChild(this.target_elem.lastChild);
    }
};

Deck.prototype.clearView = function deckClearView() {
    this.target_elem.innerHTML = "";
};

function addButtonListener(elem, listener) {
    if (elem.addEventListener) {
        elem.addEventListener("click", listener, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("onclick", listener);
    }
}

// TODOs:
//    * [done] Implement a card deck
//    * Implement user interaction
//    * Implement config saving and loading


function displayData() {}

let db;

window.onload = function() {
    let request = window.indexedDB.open("foobar_db", 1);

    request.onerror = function() {
        console.log('Database failed to open.');
    };

    request.onsuccess = function() {
        console.log('Database opened successfully.');
        db = request.result;
        displayData();
    };

    request.onupgradeneeded = function(ev) {
        let db = ev.target.result;
        let objectStore = db.createObjectStore("foobar_os", {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('title', 'title', {unique: false});
        objectStore.createIndex('body', 'body', {unique: false});

        console.log('Database setup complete');
    };
}

function addData(title, body) {
    let newItem = {title: title, body: body};
    let transaction = db.transaction(['foobar_os'], 'readwrite');
    let objectStore = transaction.objectStore('foobar_os');
    let request = objectStore.add(newItem);

    request.onsuccess = function() {
        console.log('data added successfully...');
    };

    transaction.oncomplete = function() {
        console.log('Transaction complete.  Database modification finished.');
        displayData();
    };

    transaction.onerror = function() {
        console.log('Transaction failed to open.');
    };

    
}
