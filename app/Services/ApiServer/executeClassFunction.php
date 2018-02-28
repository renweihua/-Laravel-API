<?php
	$return_list = $this->executeClassFunction($method_list);
    if(empty($return_list['status'])) $return[$return_list['data_name']]['msg'] = $return_list['data'] ?? "";
    else $return[$return_list['data_name']]['data'] = $return_list['data'] ?? [];
    $return[$return_list['data_name']]['status'] = $return_list['status'] ?? 1;
    $return[$return_list['data_name']]['code'] = $return_list['code'] ?? 200;