using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class healthDrop : MonoBehaviour, ICollectFunctions
{
    //Item component
    GameObject itemGO;

    //player components
    GameObject player;
    PlayerStatistics playerStats;

    //healthDrop effects
    public float healthPoint = 10.0f;

    //spawn location
    private Vector3 off;

    //hierarchy index; look at the DropObjectSpawnManager in GameScene
    private int Item_Index = 0;

    private void Awake()
    {
        //Random spawn x and y axis location
        off = new Vector3(Random.Range(-3, 3), Random.Range(-3, 3), off.z);
    }

    // Start is called before the first frame update
    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player");
        playerStats = player.GetComponent<PlayerStatistics>();
        itemGO = this.gameObject;
    }
    //When to stop bouncing
    float bounceTime = 0.25f;
    float bounceTicks = 0.0f;

    // Update is called once per frame
    void Update()
    {
        if (bounceTicks < bounceTime)
        {
            bounceTicks += Time.deltaTime;
            //position of object
            this.transform.position += off * Time.deltaTime;
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.transform.CompareTag("Player"))
        {
            //Debug.LogError("Health collected!");
            //apply the effect of the items
            collectEffect();
            //remove the item after the player collect/received it
            DropItemSpawn itemSpawn = this.transform.parent.GetComponent<DropItemSpawn>();
            itemSpawn.destroyItem(ref this.itemGO, Item_Index);
        }
    }

    public void collectEffect()
    {
        //checks if the needed references are still null
        if(this.player == null)
        {
            this.player = GameObject.FindGameObjectWithTag("Player");
        }
        if (this.playerStats == null)
        {
            this.playerStats = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerStatistics>();
        }
        //adds the effect
        playerStats.PlayerHealth += this.healthPoint;
        Mathf.Clamp(playerStats.PlayerHealth, 0, playerStats.playerMaxHealth);
    }
}