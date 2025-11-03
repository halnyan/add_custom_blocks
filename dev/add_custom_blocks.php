<?php
/**
 * Plugin Name: add_custom_blocks
 * Description: クラスとタグを選べるシンプルなブロックとa / p / span / div を切り替えられるカスタムテキストブロック。
 * Version: 1.0.0
 * Author: adachi_adaptive
 */

defined( 'ABSPATH' ) || exit;

function add_custom_blocks_register() {

    // block.json に基づいてブロックを登録
    register_block_type( __DIR__ . '/build/blocks/clean-wrapper-block' );
    register_block_type( __DIR__ . '/build/blocks/custom-text-block' );
}
add_action( 'init', 'add_custom_blocks_register' );
