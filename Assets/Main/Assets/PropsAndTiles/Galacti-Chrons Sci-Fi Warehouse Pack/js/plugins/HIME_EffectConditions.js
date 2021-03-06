/*:
-------------------------------------------------------------------------------
@title Effect Conditions
@author Hime --> HimeWorks (http://himeworks.com)
@date Feb 7, 2015
@version 1.1
@filename HIME_EffectConditions.js
@url http://himeworks.com/2016/02/effect-conditions/

If you enjoy my work, consider supporting me on Patreon!

https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

Main Website: http://himeworks.com
Facebook: https://www.facebook.com/himeworkscom/
Twitter: https://twitter.com/HimeWorks
Youtube: https://www.youtube.com/c/HimeWorks
Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc v1.1 - Add conditions that must be met in order for your
skills or item effects to execute!
@help 
-------------------------------------------------------------------------------
== Description ==

In RPG Maker, you can assign effects to items or skills.

Effects are special behaviors that occur when the item or skill is
successfully executed.

For example, you can create a "Poison" skill that has a 50% chance to
add a "Poison" state to the target, or you can create a "Skill Book"
item that will teach a new skill to a particular actor when that actor is
selected.

Now, let's say you had a skill book that teaches Fire, but only magic users
can learn it. Do you want non-magic users to be able to use the book as
well? Maybe not.

In this situation, it would be useful to be able to define "conditions" that
must be met in order for the skill book to be used.

This plugin allows you to define "effect conditions", which are conditions
that are given to each and every effect on an item or skill. Before an effect
can be applied, all conditions must be met.

With these conditions, you can now check whether the actor that you would
like to use it on is able to learn Fire!

Effect conditions are formulas, so you can create conditions on anything
that you can imagine.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

1.1 - Feb 8, 2015
 * forgot to "call" the aliased item test method
1.0 - Feb 7, 2015
 * initial release

== Usage ==

To create an effect condition, note-tag skills or items with

  <effect condition: ID1, ID2, ... >
     FORMULA
  </effect condition>
  
ID1, ID2, and so on are the effects that this condition applies
to.

FORMULA is the condition that will be added to the specified effects.
The following formula variables are available:

  a - the user of the item/skill
  b - the target of the item/skill
  i - the item/skill being used
  v - game variables
  s - game switches
  p - game party
  t - game troop
  
  -- Example --
  
So for example, let's say you had an item called "Fire Skill Book" which
teaches the "Fire" spell.

You would add one effect to the item called "Learn Skill" that will add
the fire spell. Now, if you used the book on anyone, you'll see that they
learn the fire skill.

We would like to add conditions for our "Learn Skill" effect now.
Let's say that only the "Magician" and "Wizard" classes can learn it.

Assuming magican is class 2 and wizard is class 4, our effect condition would
start by targeting the first effect in the list, with a formula that checks
the class of the target:

  <effect condition: 1>
    b.isClass($dataClasses[2]) || b.isClass($dataClasses[4])
  </effect condition>
  
Translating the formula into natural language, it means

  is the target class 2 or class 4?
  
If any of those conditions are true, our effect condition is satisfied, and
we can proceed to teach the target the fire spell.

-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_EffectConditions = 1;
TH.EffectConditions = TH.EffectConditions || {};

(function ($) {

  $.Regex = /<effect[-_ ]condition:(.+?)>([\s\S]*?)<\/effect[[-_ ]condition>/img

  $.loadEffectConditions = function(data) {
    if (data.effects !== undefined) {
      var res;
      while (res = $.Regex.exec(data.note)) {
        var ids = res[1].trim().split(",");
        var cond = res[2].trim();
        
        for (var i = 0; i < ids.length; i++) {
          var id = Math.floor(ids[i]) - 1;
          var eff = data.effects[id];
          eff.conditions = eff.conditions || [];
          eff.conditions.push(cond);
        }
      }
    }
  };
  
  var TH_DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    TH_DataManager_onLoad.call(this, object);
    if (object === $dataSkills || object === $dataItems) {
      for (var i = 1, len = object.length; i < len; i++) {
        $.loadEffectConditions(object[i]);
      }
    }
  };
  
  var TH_GameAction_testItemEffect = Game_Action.prototype.testItemEffect;
  Game_Action.prototype.testItemEffect = function(target, effect) {
    if (!this.areEffectConditionsMet(target, effect)) {
      return false;      
    }
    return TH_GameAction_testItemEffect.call(this, target, effect);
  };

  var TH_GameAction_applyItemEffect = Game_Action.prototype.applyItemEffect;
  Game_Action.prototype.applyItemEffect = function(target, effect) {
    if (this.areEffectConditionsMet(target, effect)) {
      TH_GameAction_applyItemEffect.call(this, target, effect);    
    }
  };
  
  Game_Action.prototype.areEffectConditionsMet = function(target, effect) {
    var conds = effect.conditions;
    if (conds) {      
      var a = this.subject();
      var b = target;
      var i = this.item();
      var v = $gameVariables;
      var s = $gameSwitches;
      var p = $gameParty;
      var t = $gameTroop;
      for (var i = 0; i < conds.length; i++) {
        if (!eval(conds[i])) {
          return false;
        }
      }
    }
    return true;
  };
})(TH.EffectConditions);