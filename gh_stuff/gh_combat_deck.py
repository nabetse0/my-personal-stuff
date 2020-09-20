"""Combat deck simulator
"""

import numpy

CONDITION_MUDDLE = 1 
CONDITION_POISON = 2 
CONDITION_WOUND = 3 
CONDITION_IMMOBILIZE = 4 
CONDITION_STUN = 5 
CONDITION_ADD_TARGET = 6 

class Condition(object):
    _CONDITION_MAP = {
        CONDITION_MUDDLE: "muddle",
        CONDITION_POISON: "poison",
        CONDITION_WOUND: "wound", 
        CONDITION_IMMOBILIZE: "immobilize", 
        CONDITION_STUN: "stun",  
        CONDITION_ADD_TARGET: "target-one-more", 
    }

    def __init__(self, condition):
        self._condition = condition
        return

    def __str__(self):
        return self._CONDITION_MAP[self._condition]

class CritModifier(object):
    def __str__(self):
        return "2x"

class NullModifier(object):
    def __str__(self):
        return "~null~"

class SpecialBlessing(object):
    def __str__(self):
        return "BLESSING"
    
class SpecialCurse(object):
    def __str__(self):
        return "CURSE"

class Card(object):
    def __init__(self, modifier=0, rolling=False, condition=None, reshuffle=False, special=None):
        self._modifier = modifier
        self._rolling = rolling
        self._condition = condition
        self._reshuffle = reshuffle
        self._special = special
        return

    def __str__(self):
        str_mod = "{:+d}".format(self._modifier) if isinstance(self._modifier, int) else self._modifier
        str_roll = "[rolling]" if self._rolling else ""
        str_cond = "[{}]".format(self._condition) if self._condition else ""
        str_reshuffle = "RESHUFFLE" if self._reshuffle else "" 
        str_special = "<{}>".format(self._special) if self._special else ""

        output = "    {mod} {roll} {cond} {reshuffle} {special}".format(
            mod=str_mod,
            roll=str_roll,
            cond=str_cond,
            reshuffle=str_reshuffle,
            special=str_special,
        )

        return output

    def __repr__(self):
        str_mod = "{:+d}".format(self._modifier) if isinstance(self._modifier, int) else self._modifier
        str_roll = "[rolling]" if self._rolling else ""
        str_cond = "[{}]".format(self._condition) if self._condition else ""
        str_reshuffle = "RESHUFFLE" if self._reshuffle else "" 
        str_special = "<{}>".format(self._special) if self._special else ""

        output = "<Card: {mod} {roll} {cond} {reshuffle} {special}>".format(
            mod=str_mod,
            roll=str_roll,
            cond=str_cond,
            reshuffle=str_reshuffle,
            special=str_special,
        )

        return output

    def __mul__(self, other):
        if not isinstance(other, int):
            raise TypeError("For multiplication, expected int; {} found".format(type(other).__name__))
        return CardStack([self] * other)

    def __rmul__(self, other):
        if not isinstance(other, int):
            raise TypeError("For multiplication, expected int; {} found".format(type(other).__name__))
        return CardStack(other * [self])

    def __add__(self, other):
        if isinstance(other, Card):
            return CardStack([self, other])
        elif isinstance(other, CardStack):
            other.insert(self)
            return other
        else:
            raise TypeError("For addition, expected Card or CardStack; {} found".format(type(other).__name__))

    @property
    def is_one_time_use(self):
        return isinstance(self._special, SpecialCurse) or isinstance(self._special, SpecialBlessing)
        

class CardStack(object):
    def __init__(self, cards=[]):
        if isinstance(cards, CardStack):
            self._cards = list(cards._cards)
            return
        
        self._cards = []

        for item in cards:
            if isinstance(item, Card):
                self.append(item)
            elif isinstance(item, CardStack):
                self += item
            else:
                raise TypeError("For addition, expected Card or CardStack; {} found".format(type(other).__name__))
                
        return

    def append(self, card):
        self._cards.append(card)
        return

    def insert(self, card):
        self._cards.insert(card, 0)
        return

    def __str__(self):
        cards_str = "\n    ".join([str(c) for c in self._cards])
        output = "CardStack\n    {}".format(cards_str)
        return output

    def __repr__(self):
        return "<CardStack with {} cards>".format(len(self._cards))

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, idx):
        return self._cards[idx]

    def __add__(self, other):
        if isinstance(other, CardStack):
            s = CardStack()
            s._cards = self._cards + other._cards
            return s
        elif isinstance(other, Card):
            s = CardStack(self)
            s.append(other)
            return s
        else:
            raise TypeError("For addition, expected Card or CardStack; {} found".format(type(other).__name__))

    def __iadd__(self, other):
        if isinstance(other, Card):
            self.append(other)
        if isinstance(other, CardStack):
            self._cards += other._cards
        return self

    def __mul__(self, other):
        if not isinstance(other, int):
            raise TypeError("For multiplication, expected int; {} found".format(type(other).__name__))
        s = CardStack(self) 
        s._cards *= other
        return s

    def __rmul__(self, other):
        if not isinstance(other, int):
            raise TypeError("For multiplication, expected int; {} found".format(type(other).__name__))
        s = CardStack(self) 
        s._cards *= other
        return s

    def __imul__(self, other):
        if not isinstance(other, int):
            raise TypeError("For multiplication, expected int; {} found".format(type(other).__name__))
        self._cards *= other
        return self

    def __iter__(self):
        for c in self._cards:
            yield c


class Deck(object):
    CARDS_IN_DECK = CardStack([
        Card(modifier=NullModifier(), reshuffle=True), 
        Card(modifier=-2),
        Card(modifier=-1) * 5,
        Card(modifier=0) * 6,
        Card(modifier=1) * 5,
        Card(modifier=2),
        Card(modifier=CritModifier(), reshuffle=True),
    ])
    def __init__(self):
        self.reset()
        return

    def reset(self):
        self._cardstack = CardStack(self.CARDS_IN_DECK)
        self._to_be_removed = []
        self._playable_indices = list(range(len(self._cardstack)))
        self._k = 0

        self._shuffled_indices = numpy.array(self._playable_indices)
        self.shuffle()
        self._total = len(self._playable_indices)
        return

    def shuffle(self):
        for idx in self._to_be_removed:
            self._playable_indices.remove(idx)

        self._shuffled_indices = numpy.array(self._playable_indices)
        numpy.random.shuffle(self._shuffled_indices)
        self._total = len(self._playable_indices)
        self._k = 0
        return

    def undo(self):
        if self._k > 0:
            self._k -= 1
        return

    def deal(self):
        if self._k >= len(self._playable_indices):
            return None

        c = self._cardstack[self._shuffled_indices[self._k]]
        if c.is_one_time_use:
            self._to_be_removed.append(self._shuffled_indices[self._k])
        self._k += 1
        return c
    
    def add_blessing(self):
        self._cardstack.append(Card(modifier=CritModifier(), special=SpecialBlessing()))
        new_idx = len(self._cardstack) - 1
        self._playable_indices.append(new_idx)
        self._shuffled_indices = numpy.append(self._shuffled_indices[self._k:], new_idx)
        numpy.random.shuffle(self._shuffled_indices)
        return

    def add_curse(self):
        self._cardstack.append(Card(modifier=NullModifier(), special=SpecialCurse()))
        new_idx = len(self._cardstack) - 1
        self._playable_indices.append(new_idx)
        self._shuffled_indices = numpy.append(self._shuffled_indices[self._k:], new_idx)
        numpy.random.shuffle(self._shuffled_indices)
        return

    @property
    def total(self):
        return self._total

    @property
    def index(self):
        return self._k

    
class Repl(object):
    def __init__(self, deck=Deck()):
        self._deck = deck
        return

    def prompt(self):
        the_prompt = "{name} ({index:d}/{total:d}): ".format(
            name=self._deck.__class__.__name__,
            index=self._deck.index,
            total=self._deck.total,
        )
        return input(the_prompt)
    
